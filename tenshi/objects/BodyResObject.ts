import StatusResponseObject from "tenshi/objects/StatusResponseObject"

interface StructureResponse {
    status: {
        id: number,
        message: string,
        http_code: number,
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
            message: status.name,
            http_code: status.httpStatus
        },
        data: dataInfo,
        info: info
    };
    return structure;
}


