// tslint:disable:member-access

import { suite, test } from 'mocha-typescript';

enum TableType {
  Master,
  Detail
}


interface IField {
  name: string;
  type: string;
}

interface ITable {
  name: string;
  type: TableType;
  fields: IField[];
}

interface IOption {
  title: string;
  doctype?: string;
  printer?: string;
  color?: string;
  copies?: string;
}


interface IData {
  table: string;
  records: { [key: string]: any };
}

interface IPrintjob {
  options: IOption[];
  data: IData[];
}

interface IRootObject {
  report: string;
  tables: ITable[];
  printjobs: IPrintjob[];
}


const doc: IRootObject = {
  report: 'Angebot.lrf',

  tables: [
    {
      name: 'Master',
      type: TableType.Master,
      fields: [
        {
          name: 'id',
          type: 'number'
        },
        {
          name: 'name',
          type: 'string'
        }
      ]
    },

  ],
  printjobs: [
    {

      options: [
        {
          title: 'Ausdruck'
        }
      ],
      data: [
        {
          table: 'Details',
          records: [
            {
              id: 1, name: 'hugo'
            },
            {
              id: 2, name: 'hirsch'
            }
          ]
        }
      ]
    }

  ]

};




@suite('json-format')
class ReflectionTest {

  @test 'should stringify doc'() {
    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(doc));
  }
}