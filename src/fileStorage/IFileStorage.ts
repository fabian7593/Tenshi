interface IFileStorage {
    uploadFile(file : Express.Multer.File, filename: string) : Promise<any>;
}

export default IFileStorage;