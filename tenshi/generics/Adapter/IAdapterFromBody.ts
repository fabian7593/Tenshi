
/*
    Every Entity need to create your own Adapter
    This is not about the desing pattern adapter, it is like the adapter of body json to entity
    This adapters implements this interface, to have the generic methods for adapt.
*/
interface IAdapterFromBody {
    //this is a body with form data, not with json body into request
    //we use it on the documents modules (see the example on POSTMAN)
    entityFromPostBodyWithParams?(body: any): any;
    //this is for a normal json body
    entityFromPostBody(): any;
    entityFromPutBody(): any;
    entityToResponse(entity: any): any;
    entitiesToResponse(entities: any[] | null): any;
    entityFromObject?(obj: any, isCreating: boolean): any;
}

export default IAdapterFromBody;