import { Config } from '@/Config';
import Logger from '@shared/Logger';
import mysql from 'mysql2/promise';
import { DatabaseEntity } from './Entities/DatabaseEntity';

interface DatabaseConnection {
    execute<T = any>(query: string, params?: any[]): Promise<[T, mysql.FieldPacket[]]>;
    ping(): Promise<void>;
}

export default class Database {
    private static connection: mysql.Connection & DatabaseConnection;
    private static logger: Logger = Logger.getLogger(Database);

    public static async init() {
        this.connection = await mysql.createConnection({
            host: Config.Database.Host,
            user: Config.Database.User,
            database: Config.Database.Database,
            password: Config.Database.Password
        }) as mysql.Connection & DatabaseConnection;

        if (!this.connection) {
            this.logger.error('Failed to connect to the database, retrying in 5 seconds...');
            setTimeout(() => this.init(), 5000);
            return;
        }

        this.logger.info('Database initialized.');
        setInterval(() => this.heartbeat(), 60000);
        this.heartbeat();
    }

    private static async heartbeat() {
        try {
            await this.connection.ping();
        } catch (error) {
            this.logger.error('Database connection lost, attempting to reconnect...');
            await this.init();
        }
    }

    public static async Select<T extends DatabaseEntity>(query: string, params: any[] = []): Promise<T[]> {
        try {
            const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(query, params);
            return rows as T[];
        } catch (error) {
            this.logger.error(`Select query failed: ${error}`);
            return [];
        }
    }

    public static async First<T extends DatabaseEntity>(query: string, params: any[] = []): Promise<T | null> {
        try {
            const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(query, params);
            const first = (rows as T[])[0];
            return first ?? null;
        } catch (error) {
            this.logger.error(`First query failed: ${error}`);
            return null;
        }
    }

    public static async Execute(query: string, params: any[] = []): Promise<mysql.ResultSetHeader | null> {
        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, params);
            return result;
        } catch (error) {
            this.logger.error(`Execute query failed: ${error}`);
            return null;
        }
    }

    public static async Insert(query: string, params: any[] = []): Promise<number | null> {
        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, params);
            return result.insertId;
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
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values);
            return result.insertId;
        } catch (error) {
            this.logger.error(`Insert query failed: ${error}`);
            return null;
        }
    }
}