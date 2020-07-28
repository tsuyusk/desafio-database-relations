import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createOrdersTable1595871642880 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'customer_id',
          type: 'uuid',
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        }
      ],
      foreignKeys: [
        {
          name: 'OrderCustomers',
          columnNames: ['customer_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'customers',
          onDelete: 'SET NULL',
        },
      ],
    },
    ))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders');
  }

}
