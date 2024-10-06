import { DataSource } from "typeorm";

export const calculateSum = (value1: number, value2: number): number => {
    const sum = value1 + value2;
    return sum;
};

export const calculateMultiply = (value1: number, value2: number): number => {
    const mul = value1 * value2;
    return mul;
};

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

export const isJWT = (token: string): boolean => {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
