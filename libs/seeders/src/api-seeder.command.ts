import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

interface BasicCommandOptions {
  fresh?: boolean;
}

@Command({ name: 'seed', description: 'A parameter parse' })
export class ApiSeederCommand extends CommandRunner {
  constructor(private dataSource: DataSource) {
    super();
  }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
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
              await this.seedData(tableName, docs, options);
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

  @Option({
    flags: '-f, --fresh [fresh]',
    description: 'A fresh seed',
  })
  parseFresh(val: string): boolean {
    return !!val;
  }

  /**
   * @param tableName - The table to seed.
   * @param data - The array of data to insert.
   * @param options
   */
  private async seedData(
    tableName: string,
    data: any[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    try {
      if (options.fresh) {
        await this.dataSource
          .createQueryRunner()
          .query(`TRUNCATE TABLE ${tableName}`);
      }
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(tableName)
        .values(data)
        .orIgnore()
        .execute();
    } catch (error) {
      console.error(`Error seeding table ${tableName}:`, error);
    } finally {
    }
  }
}
