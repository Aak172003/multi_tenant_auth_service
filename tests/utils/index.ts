import { DataSource } from "typeorm";

export const truncateTables = async (connection: DataSource) => {
    // This provide all enities lies which i had created in this entity folder
    const entities = connection.entityMetadatas;

    console.log("this is entities ----- ", entities);

    // Loop over entities
    for (const entity of entities) {
        const repositery = connection.getRepository(entity.name);

        // this will show repositery
        console.log("this is repositery ----- ", repositery);

        // clear is like clear all the columns
        await repositery.clear();
    }
};
