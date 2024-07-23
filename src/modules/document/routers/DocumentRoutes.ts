import { Request, Response, GenericRoutes,
    RequestHandler, RequestHandlerBuilder, 
    FindManyOptions } from "@modules/index";

import { Document, DocumentController, DocumentDTO, multer } from '@document/index';
import { getUrlParam } from "@utils/generalUtils";
import { injectable } from 'inversify';
import {default as config} from "@root/unbreakable-config";

const storage = multer.memoryStorage(); // Almacenamiento en memoria
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: config.FILE.GENERAL.MAX_FILE_SIZE * 1024 * 1024, // 50 MB (en bytes)
      }
});

@injectable()
class DocumentRoutes extends GenericRoutes {
    constructor() {
        super(new DocumentController(Document));
    }

    protected initializeRoutes() {

        this.router.get(`${this.routerName}/get_by_some_params`, async (req: Request, res: Response) => {
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
                options.where = { ...options.where, userId: userId};
            }
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("getDocumentBySomeParams")
                                    .setFilters(options)
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getByFilters(requestHandler);
        });
        
        this.router.get(`${this.routerName}/get_by_name`, async (req: Request, res: Response) => {
            const nameParam : string = getUrlParam("name", req);
        
            let options : FindManyOptions;
            options = { where: { name : nameParam}  }; 
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("getDocumentByName")
                                    .setFilters(options)
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getByFilters(requestHandler);
        });
        
        this.router.get(`${this.routerName}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("getDocuments")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .build();
        
            this.controller.getAll(requestHandler);
        });
        
        this.router.post(`${this.routerName}/add`,  upload.single('file'), async (req: Request, res: Response) => {
        
            const requiredBodyList:  Array<string> = 
                [req.body.type, req.body.table, 
                req.body.user_id, req.body.id_for_table];
            
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("insertDocument")
                                    //.setRequiredFiles(requiredBodyList)
                                    .isValidateRole()
                                    .build();
        
            this.controller.insert(requestHandler);
        });
        
        this.router.put(`${this.routerName}/edit`,  upload.single('file'), async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("updateDocument")
                                    .isValidateRole()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.controller.update(requestHandler);
        });
        
        
        this.router.delete(`${this.routerName}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new DocumentDTO(req))
                                    .setMethod("deleteDocument")
                                    .isValidateRole()
                                    .isLogicalRemove()
                                    .isValidateWhereByUserId()
                                    .build();
        
            this.controller.delete(requestHandler);
        });
    }

}
export default DocumentRoutes;
