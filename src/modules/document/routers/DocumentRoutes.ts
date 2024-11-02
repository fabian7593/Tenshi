import { Request, Response, GenericRoutes,
    RequestHandler, RequestHandlerBuilder, 
    FindManyOptions } from "@modules/index";

import { config } from "@index/index";
import { DocumentController, DocumentDTO, multer } from '@modules/document/index';
import { getUrlParam } from "@TenshiJS/utils/generalUtils";

const storage = multer.memoryStorage(); // Almacenamiento en memoria
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: config.FILE_STORAGE.GENERAL.MAX_FILE_SIZE * 1024 * 1024, // 50 MB (en bytes)
      }
});

class DocumentRoutes extends GenericRoutes {
    constructor() {
        super(new DocumentController());
    }

    protected initializeRoutes() {

        this.router.get(`${this.getRouterName()}/get_by_filters`, async (req: Request, res: Response) => {
            const nameParam : string | null = getUrlParam("name", req) || null;
            const extensionParam : string | null = getUrlParam("ext", req) || null;
            const actionTypeParam : string | null = getUrlParam("action_type", req) || null;
            const typeParam : string | null = getUrlParam("type", req) || null;
            const tableParam : string | null = getUrlParam("table", req) || null;
            const userId : string | null = getUrlParam("user_id", req) || null;
        
            const options: FindManyOptions = {};
            if(nameParam != null){
                options.where = { ...options.where, name: nameParam};
            }
        
            if(extensionParam != null){
                options.where = { ...options.where, extension: extensionParam};
            }
        
            if(actionTypeParam != null){
                options.where = { ...options.where, action_type: actionTypeParam};
            }
        
            if(typeParam != null){
                options.where = { ...options.where, type: typeParam};
            }
        
            if(tableParam != null){
                options.where = { ...options.where, table: tableParam};
            }
        
            if(userId != null){
                options.where = { ...options.where, user_id: userId};
            }
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("getDocumentBySomeParams")
                                    .setFilters(options)
                                    .isValidateRole("DOCUMENT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getByFilters(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_by_code`, async (req: Request, res: Response) => {
          
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("getDocumentByCode")
                                    .isValidateRole("DOCUMENT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getByCode(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("getDocuments")
                                    .isValidateRole("DOCUMENT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`,  upload.single('file'), async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("insertDocument")
                                    .isValidateRole("DOCUMENT")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`,  upload.single('file'), async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("updateDocument")
                                    .isValidateRole("DOCUMENT")
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("deleteDocument")
                                    .isValidateRole("DOCUMENT")
                                    .isLogicalDelete()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }

}
export default DocumentRoutes;
