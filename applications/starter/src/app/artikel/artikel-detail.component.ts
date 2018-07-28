/* tslint:disable:use-life-cycle-interface -> BaseComponent */

// Angular
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { MessageService, MetadataService, ServiceRequestsComponent } from '@fluxgate/client';
import { IExtendedCrudServiceState, ItemCreatedCommand, ItemUpdatedCommand, ServiceCommand } from '@fluxgate/common';

import { Artikel } from '@fluxgate/starter-common';
import { ArtikelServiceRequests } from '../redux/artikel-service-requests';


@Component({
  selector: 'app-artikel-detail',
  templateUrl: './artikel-detail-form.component.html',
  styleUrls: ['./artikel-detail.component.css']
})
export class ArtikelDetailComponent extends ServiceRequestsComponent<Artikel, ArtikelServiceRequests> {
  protected static readonly logger = getLogger(ArtikelDetailComponent);

  public static ARTIKEL_DETAIL = 'Artikel Detail';
  public pageTitle: string = ArtikelDetailComponent.ARTIKEL_DETAIL;
  public artikel: Artikel;

  constructor(private fb: FormBuilder, router: Router, route: ActivatedRoute, messageService: MessageService,
    private metadataService: MetadataService, serviceRequests: ArtikelServiceRequests) {
    super(router, route, messageService, serviceRequests);

    this.artikel = this.buildFormFromModel<Artikel>(this.fb, Artikel, this.metadataService);
  }


  public ngOnInit(): void {
    using(new XLog(ArtikelDetailComponent.logger, levels.INFO, 'ngOnInit'), (log) => {
      super.ngOnInit();

      this.registerSubscription(this.route.data
        .subscribe((data: { artikel: Artikel }) => {
          log.log(`department = ${JSON.stringify(data.artikel)}`);

          this.artikel = data.artikel;
        }));
    });
  }


  public submit() {
    if (this.artikel.id > 0) {
      this.serviceRequests.update(this.artikel).subscribe((item) => {
        this.resetForm();
        this.navigateBack();
      });
    } else {
      this.serviceRequests.create(this.artikel).subscribe((item) => {
        this.resetForm();
        this.navigateBack();
      });
    }
  }

  public confirmDelete() {
    super.confirmDelete('Artikel löschen', `Soll der Artikel wirklich gelöscht werden: ${this.artikel.name}?`,
      () => {
        this.serviceRequests.delete(this.artikel).subscribe((id) => {
          this.resetForm();
          this.navigateBack();
        });
      });
  }


  public cancel(): void {
    this.navigateBack();
  }


  protected onStoreUpdated(command: ServiceCommand<Artikel>): void {
    super.onStoreUpdated(command);

    if (command.storeId === this.storeId) {
      const state = this.getState<IExtendedCrudServiceState<Artikel, number>>();

      if (command instanceof ItemUpdatedCommand || command instanceof ItemCreatedCommand) {
        this.resetForm();
        this.serviceRequests.setCurrent(state.item);
      }
    }
  }

  private navigateBack() {
    this.navigate(['/artikel']);
  }
}