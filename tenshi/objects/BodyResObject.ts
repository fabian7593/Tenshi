import StatusResponseObject from "tenshi/objects/StatusResponseObject"

export interface structPagination {
   
        total: number,
        page: number,
        size: number,
        total_pages: number
    
}

interface StructureResponse {
    status: {
        id: number,
        message: string,
        http_code: number,
    },
    data: any | null,
    info: string | null,
    pagination?: structPagination | null
    
}


//This method return the structure of the response.
export function responseStruct(
    status: StatusResponseObject,
    dataInfo?: any,
    info: string | null = null,
    pagination: structPagination | null = null
): StructureResponse {
    const structure: StructureResponse = {
        status: {
            id: status.id,
            message: status.name,
            http_code: status.httpStatus
        },
        data: dataInfo,
        info: info
    };

    if (pagination) {
        structure.pagination = pagination;
    }

    return structure;
}


