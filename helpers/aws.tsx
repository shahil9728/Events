import AWS from 'aws-sdk';

// AWS Configuration
const S3_BUCKET = 'userresume9728';
const REGION = 'ap-south-1';
const ACCESS_KEY = 'AKIAVVZOOHA33V3UBNQZ';
const SECRET_KEY = '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';

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
});

const s3 = new AWS.S3();

/**
 * Uploads a file to AWS S3 and returns the file URL
 * @param {string} fileUri - The local file URI to upload
 * @param {string} fileName - The name of the file in the S3 bucket
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export const uploadToS3 = async (fileUri: string, fileName: string, userId: string, folder: string) => {
    try {
        const fileExtension = fileUri.split('.').pop()?.toLowerCase() || 'unknown';
        const fileKey = `${folder}/${userId}/${fileName}.${fileExtension}`;

        // Fetch the file as a Blob
        const response = await fetch(fileUri);
        if (!response.ok) throw new Error("Failed to fetch the file from the given URI");

        const fileBlob = await response.blob();

        const params: AWS.S3.PutObjectRequest = {
            Bucket: S3_BUCKET,
            Key: fileKey,
            Body: fileBlob,
            ContentType: fileBlob.type || 'application/octet-stream',
            ACL: 'public-read',
        };

        // Upload the file to S3
        return new Promise((resolve, reject) => {
            s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    console.error('Error uploading to S3:', err.message);
                    reject(err.message);
                } else {
                    console.log('File uploaded successfully:', data.Location);
                    resolve(data.Location); // Return the public file URL
                }
            });
        });
    } catch (error) {
        console.error('Error preparing file for S3 upload:', (error as Error).message);
        throw new Error('Failed to upload file to S3.');
    }
};

/**
 * Deletes a file from AWS S3
 * @param {string} fileUrl - The URL of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFromS3 = async (fileUrl: string) => {
    try {
        const fileKey = fileUrl.split(`${S3_BUCKET}/`)[1];
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: S3_BUCKET,
            Key: fileKey,
        };

        return new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.error('Error deleting from S3:', err.message);
                    reject(err.message);
                } else {
                    console.log('File deleted successfully:', data);
                    resolve(undefined);
                }
            });
        });
    } catch (error) {
        console.error('Error preparing file for S3 deletion:', (error as Error).message);
        throw new Error('Failed to delete file from S3.');
    }
};
