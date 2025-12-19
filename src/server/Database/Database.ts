import { Config } from '@/Config';
import Logger from '@shared/Logger';
import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from './Entities/UserEntity';
import { VehicleEntity } from './Entities/VehicleEntity';
import { MoneyLogEntity } from './Entities/MoneyLogEntity';

export default class Database {
	private static sequelize: Sequelize;
	private static logger: Logger = Logger.getLogger(Database);

	public static async init() {
		try {
			this.sequelize = new Sequelize({
				database: Config.Database.Database,
				dialect: 'mysql',
				username: Config.Database.User,
				password: Config.Database.Password,
				host: Config.Database.Host,
				logging: false, // Set to console.log to see SQL queries
				models: [UserEntity, VehicleEntity, MoneyLogEntity],
				pool: {
					max: 10,
					min: 0,
					acquire: 30000,
					idle: 10000
				}
			});

			// Test the connection
			await this.sequelize.authenticate();
			this.logger.info('Database connection established successfully.');

			// Sync models (without altering existing tables)
			await this.sequelize.sync({ alter: false });
			this.logger.info('Database models synchronized.');

			// Set up heartbeat
			setInterval(() => this.heartbeat(), 60000);
		} catch (error) {
			this.logger.error(`Failed to connect to the database: ${error}`);
			this.logger.error('Retrying in 5 seconds...');
			setTimeout(() => this.init(), 5000);
		}
	}

	private static async heartbeat() {
		try {
			await this.sequelize.authenticate();
		} catch (error) {
			this.logger.error('Database connection lost, attempting to reconnect...');
			await this.init();
		}
	}

	public static getSequelize(): Sequelize {
		return this.sequelize;
	}

	// Backwards compatibility methods (these are now deprecated, use Sequelize models directly)
	public static async Select<T>(entityClass: any, query: string, params: any[] = []): Promise<T[]> {
		try {
			const [results] = await this.sequelize.query(query, {
				replacements: params,
				raw: true
			});
			return results as T[];
		} catch (error) {
			this.logger.error(`Select query failed: ${error}`);
			return [];
		}
	}

	public static async First<T>(query: string, params: any[] = []): Promise<T | null> {
		try {
			const [results] = await this.sequelize.query(query, {
				replacements: params,
				raw: true
			});
			const rows = results as T[];
			return rows[0] ?? null;
		} catch (error) {
			this.logger.error(`First query failed: ${error}`);
			return null;
		}
	}

	public static async Execute(query: string, params: any[] = []): Promise<any> {
		try {
			const [results, metadata] = await this.sequelize.query(query, {
				replacements: params
			});
			return metadata;
		} catch (error) {
			this.logger.error(`Execute query failed: ${error}`);
			return null;
		}
	}

	public static async Insert(query: string, params: any[] = []): Promise<number | null> {
		try {
			const [results, metadata] = await this.sequelize.query(query, {
				replacements: params
			});
			return (metadata as any)?.insertId ?? null;
		} catch (error) {
			this.logger.error(`Insert query failed: ${error}`);
			return null;
		}
	}

	public static async InsertEntity<T extends Record<string, any>>(tableName: string, entity: T): Promise<number | null> {
		try {
			const columns = Object.keys(entity);
			const values = Object.values(entity);
			const placeholders = columns.map(() => '?').join(', ');

			const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
			const [results, metadata] = await this.sequelize.query(query, {
				replacements: values
			});
			return (metadata as any)?.insertId ?? null;
		} catch (error) {
			this.logger.error(`Insert query failed: ${error}`);
			return null;
		}
	}
}
