/* tslint:disable:use-life-cycle-interface -> BaseComponent */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------


// Fluxgate
import { FormActions, MessageService, PrintService, ServiceRequestsComponent } from '@fluxgate/client';
import {
  CurrentItemSetCommand, IExtendedCrudServiceState, ItemsFoundCommand, ItemsQueriedCommand,
  Printing, ServiceCommand
} from '@fluxgate/common';


// Model
import { Artikel } from '@fluxgate/starter-common';
import { ArtikelServiceRequests } from '../redux/artikel-service-requests';

@Component({
  selector: 'app-artikel-list',
  templateUrl: './artikel-list.component.html',
  styleUrls: ['./artikel-list.component.css']
})
export class ArtikelListComponent extends ServiceRequestsComponent<Artikel, ArtikelServiceRequests> {
  protected static readonly logger = getLogger(ArtikelListComponent);

  public title: string = 'Artikelliste';
  public artikel: Artikel[];
  public selectedArtikel: Artikel;
  // public config: IAutoformConfig;

  // Selektion
  // private selectedArtikel: Artikel;

  constructor(router: Router, route: ActivatedRoute, messageService: MessageService,
    serviceRequests: ArtikelServiceRequests, private printService: PrintService) {
    super(router, route, messageService, serviceRequests);

    this.serviceRequests.find().subscribe((items) => {
      // ok
    });
  }

  public ngOnInit() {
    super.ngOnInit();
    using(new XLog(ArtikelListComponent.logger, levels.INFO, 'ngOnInit'), (log) => {

      this.serviceRequests.find().subscribe((items) => {
        const state = this.getState<IExtendedCrudServiceState<Artikel, number>>();
        this.artikel = state.items;

        const item = this.selectItem(items, state.currentItem);   // alte Selektion wiederherstellen
        this.onSelectedValueChange(item);
      });
    });
  }

  public onRowDblclick(event: any) {
    using(new XLog(ArtikelListComponent.logger, levels.INFO, 'onDblclick'), (log) => {
      log.info(`selectedArtikel = ${JSON.stringify(this.selectedArtikel)}`);

      if (this.selectedArtikel) {
        this.navigate([FormActions.UPDATE, this.selectedArtikel.id], { relativeTo: this.route });
      }
    });
  }


  public onSelectedValueChange(artikel: Artikel) {
    using(new XLog(ArtikelListComponent.logger, levels.INFO, 'onSelectedValueChange'), (log) => {
      log.info(`artikel = ${JSON.stringify(artikel)}`);
      this.serviceRequests.setCurrent(artikel).subscribe((item) => {
        // ok
      });
    });
  }


  public print() {
    using(new XLog(ArtikelListComponent.logger, levels.INFO, 'print'), (log) => {

      this.printService.getPrinters().subscribe((printers) => {
        log.log(`getPrinters: ${JSON.stringify(printers)}`);
      });

      // const printTask = Printing.createPrintTask<Artikel>('artikel.lrf', null, {
      //   rows: this.artikel,
      //   columns: [
      //     'nummer',
      //     'name'
      //   ]
      // });

      const artikel2 = [
        this.artikel[0],
        this.artikel[1]
      ];

      const printTask = Printing.createPrintTaskMasterDetails<Artikel, Artikel>('angebot-artikel.lrf', null, {
        rows: [this.artikel[0]],
        columns: [
          'nummer',
          'name'
        ]
      }, {
          rows: artikel2,
          columns: [
            'nummer',
            'name'
          ]
        });

      const options /*: IPrintOptions*/ = [
        {
          title: 'Artikel#1 Testausdruck',
          doctype: 'A4',
          orientation: 'portrait',
          printer: 'HP Officejet Pro 8620 (Netzwerk)',
          tray: 'Fach 1',
          copies: '1',
          pagefrom: '1',
          pageto: '9999'
        }
      ];
      printTask.printJobs[0].options = options as any;

      printTask.tables[0].name = printTask.tables[0].name + 'Master';
      printTask.printJobs[0].data[0].table = printTask.printJobs[0].data[0].table + 'Master';


      log.log(`printTask: ${JSON.stringify(printTask)}`);

      this.printService.print(printTask).subscribe((result) => {
        log.log(`result: ${JSON.stringify(result)}`);
      });
    });
  }


  protected onStoreUpdated(command: ServiceCommand<Artikel>): void {
    super.onStoreUpdated(command);

    /**
     * ein Kommando für unseren Store?
     */
    if (command.storeId === this.storeId) {
      const state = this.getState<IExtendedCrudServiceState<Artikel, number>>();

      if (command instanceof ItemsFoundCommand || command instanceof ItemsQueriedCommand) {
        this.artikel = [...state.items];
        this.selectedArtikel = state.currentItem;
      }

      if (command instanceof CurrentItemSetCommand) {
        this.selectedArtikel = state.currentItem;
      }
    }
  }
}