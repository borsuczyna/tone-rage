export class DatabaseEntity {
	uid: number = 0;

	// Method to handle type conversions after loading from database
	protected convertDatabaseTypes(): void {
		// Convert uid to number if it's a string
		if (typeof this.uid === 'string') {
			this.uid = parseInt(this.uid);
		}
	}

	// Static method to create properly typed entity from database row
	static fromDatabaseRow<T extends DatabaseEntity>(this: new () => T, row: any): T {
		const entity = Object.assign(new this(), row);
		entity.convertDatabaseTypes();
		return entity;
	}
}
