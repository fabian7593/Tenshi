import StatusResponseObject from "./StatusResponseObject"

interface StructureResponse {
    status: {
        id: number,
        message: string
    },
    data: any | null,
    info: string | null
}

//This method return the structure of the response.
export function responseStruct(status : StatusResponseObject, 
                               dataInfo?: any, info: string | null = null): StructureResponse {
    const structure: StructureResponse = {
        status: {
            id: status.id,
            message: status.name
        },
        data: dataInfo,
        info: info
    };
    return structure;
}


