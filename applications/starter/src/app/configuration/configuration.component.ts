import { Component, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { FormActions, MessageService, ServiceRequestsComponent } from '@fluxgate/client';
import {
  ConfigBase, CurrentItemSetCommand, IExtendedCrudServiceState, ItemsFoundCommand, ItemsQueriedCommand,
  ServiceCommand
} from '@fluxgate/common';
import { ConfigServiceRequests } from '@fluxgate/components';



@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent extends ServiceRequestsComponent<ConfigBase, ConfigServiceRequests> {
  protected static readonly logger = getLogger(ConfigurationComponent);

  public configurations: ConfigBase[];
  private activeConfigs: Set<string> = new Set<string>();
  private selectedConfig: ConfigBase;

  constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    serviceRequests: ConfigServiceRequests) {
    super(router, route, messageService, serviceRequests);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    super.ngOnInit();
    using(new XLog(ConfigurationComponent.logger, levels.INFO, 'ngOnInit'), (log) => {

      this.serviceRequests.find().subscribe((items) => {
        const state = this.getState<IExtendedCrudServiceState<ConfigBase, string>>();
        this.configurations = state.items;

        const item = this.selectItem(items, state.currentItem);   // alte Selektion wiederherstellen

        this.setActive(item);
      });
    });
  }

  public setActive(config: ConfigBase) {
    this.serviceRequests.setCurrent(config).subscribe((item) => {
      this.activeConfigs.clear();
      if (item) {
        this.activeConfigs.add(config.id);
      }
    });
  }


  public getActive(config: ConfigBase): string {
    if (!config) {
      return '';
    }
    return this.activeConfigs.has(config.id) ? 'active' : '';
  }

  protected onStoreUpdated(command: ServiceCommand<ConfigBase>): void {
    super.onStoreUpdated(command);

    /**
     * ein Kommando für unseren Store?
     */
    if (command.storeId === this.storeId) {
      const state = this.getState<IExtendedCrudServiceState<ConfigBase, string>>();

      if (command instanceof ItemsFoundCommand || command instanceof ItemsQueriedCommand) {
        this.configurations = [...state.items];
        this.selectedConfig = state.currentItem;
      }

      if (command instanceof CurrentItemSetCommand) {
        this.selectedConfig = state.currentItem;

        if (this.selectedConfig) {
          this.navigate([FormActions.UPDATE, this.selectedConfig.id], { relativeTo: this.route });
        }
      }
    }
  }

}