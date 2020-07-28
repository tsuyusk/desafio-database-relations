import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createOrdersProductsTable1595871774511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'orders_products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'product_id',
          type: 'uuid',
        },
        {
          name: 'order_id',
          type: 'uuid',
        },
        {
          name: 'price',
          type: 'decimal',
          precision: 10,
          scale: 2,
        },
        {
          name: 'quantity',
          type: 'int',
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
        },
      ],
      foreignKeys: [
        {
          name: 'OrdersProductsProduct',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'SET NULL',
        },
        {
          name: 'OrdersProductsOrder',
          columnNames: ['order_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onDelete: 'SET NULL',
        },
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders_products');
  }

}
