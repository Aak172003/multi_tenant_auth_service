import { DataSource } from "typeorm";

export const truncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;

    console.log("this is entities ----- ", entities);

    for (const entity of entities) {
        const repositery = connection.getRepository(entity.name);

        console.log("this is repositery ----- ", repositery);

        await repositery.clear();
    }
};
