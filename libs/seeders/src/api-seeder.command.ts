import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Command({ name: 'seed', description: 'A parameter parse' })
export class ApiSeederCommand extends CommandRunner {
  constructor(private dataSource: DataSource) {
    super();
  }

  async run(passedParam: string[], options?: Record<string, never>): Promise<void> {
    const task = new Promise((resolve, reject) => {
      const docDir = path.join(__dirname, 'data');

      fs.readdir(docDir, async (err, files) => {
        //handling error
        if (err) {
          return reject('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        for (const file of files) {
          try {
            if (file.match(/.js$/) !== null) {
              const { default: docs } = await import(path.join(docDir, file));
              const tableName = file.replace('.js', '');

              // Insert the data into the corresponding PostgreSQL table
              await this.seedData(tableName, docs);
              console.log(`Seeded data for table: ${tableName}`);
            }
          } catch (e) {
            console.log('error: %s', e);
          }
        }
        return resolve('Pgsql Seeding is successful');
      });
    });

    try {
      const res = await task;
      console.log('res: %s', res);
    } catch (e) {
      console.log('err: %s', e);
    }
  }

  /**
   * Method to seed data into PostgreSQL for a specific table.
   * @param tableName - The table to seed.
   * @param data - The array of data to insert.
   */
  private async seedData(tableName: string, data: any[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Insert data into the table
      for (const record of data) {
        await queryRunner.manager.insert(tableName, record);
      }
    } catch (error) {
      console.error(`Error seeding table ${tableName}:`, error);
    } finally {
      await queryRunner.release();
    }
  }
}
