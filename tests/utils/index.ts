import { DataSource } from "typeorm";

export const truncateTables = async (connection: DataSource) => {
    // This provide all enities lies which i had created in this entity folder
    const entities = connection.entityMetadatas;

    // Loop over entities
    for (const entity of entities) {
        // this will show repositery
        const repositery = connection.getRepository(entity.name);

        // clear is like clear all the columns
        await repositery.clear();
    }
};
