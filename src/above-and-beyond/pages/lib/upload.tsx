import {Modal, Upload} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import React, {useState} from "react";
import {useAsync} from "./hooks/useAsync";
import {UploadRequestOption} from "rc-upload/lib/interface";
import type {Reference} from "@firebase/storage-types";
import {UploadChangeParam} from "antd/lib/upload";
import {UploadFile} from 'antd/lib/upload/interface';
import {css} from "@emotion/react";
import firebase from "firebase/compat/app";
import {useFileUpload} from "./storage/file";
import TaskEvent = firebase.storage.TaskEvent;

export enum UploadStates {
    FIREBASE_UPLOAD_PROGRESS,
    FIREBASE_UPLOAD_ERROR,
    FIREBASE_UPLOAD_END
}

export const getBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const uploadFile = ({
                               onSuccess,
                               onProgress,
                               onError,
                               file,
                               baseRef
                           }: Pick<UploadRequestOption, "onError" | "onProgress" | "file" | "onSuccess"> & { baseRef: Reference }) => {

    const storageRef = baseRef.child(file.name);
    const task = storageRef.put(file);
    return new Promise((resolve, reject) => {
        task.on(
            TaskEvent.STATE_CHANGED,
            {
                next(snapshot) {
                    onProgress({
                        percent: Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    }, file);
                },
                error(err) {
                    onError(err, file);
                },

                complete() {
                    const fileRef = task.snapshot.ref

                    fileRef.getDownloadURL()
                        .then(fileUrl => {
                            return onSuccess(fileUrl, file)
                        }).then(resolve);
                }
            }
        )

    });
};

export interface FileType {
    url?: string;
    name: string;
    status: string;
    uid: string;
    size: number;
    type: string;
    originFileObj?: File
}

export interface UploadState {
    onProgress?: boolean
    onComplete?: boolean
    upLoadError?: Error
    previewVisible: boolean
    PreviewComponent: React.ComponentType
    previewTitle: string
}

export const useStorageClient = (...paths) => {

    const storageRef = useFileUpload(...paths)
    const [fileList, setFileList] = useState([])

    const manualSubmit = async (path = '') => {
        const noop = () => ({})
        const baseRef = storageRef.child(path)
        await Promise.all(
            fileList
                .filter((file) => {
                    return !file.status
                })
                .map((file) => uploadFile({
                    file: file.originFileObj ?? file,
                    baseRef,
                    onError: noop,
                    onProgress: noop,
                    onSuccess: noop,
                }))
        );
    }

    return {storageRef, fileList, manualSubmit, setFileList}

};
export const UploadContainer = ({
                                    isManualSubmit,
                                    storageClient,
                                }: { isManualSubmit?: boolean, storageClient: ReturnType<typeof useStorageClient> }) => {
    const [{
        PreviewComponent,
        ...state
    }, updateState] = useState<UploadState>({
        previewVisible: false,
        PreviewComponent: <></>,
        previewTitle: '',
    } as any)

    const mergeState = (values: Partial<UploadState>) => updateState((prev) => ({...prev, ...values}))

    const handleCancel = () => mergeState({
        previewVisible: false
    });

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        const url = file.url || file.preview
        let PreviewComponent;
        if (/image\/.*/.test(file.type)) {
            PreviewComponent =
                <img css={{width: '100%'}} alt={'preview image'}
                     src={url}/>;
        } else {
            PreviewComponent = <a href={url} target="_blank">{file.name}</a>
        }

        mergeState({
            PreviewComponent,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    const handleChange = (info: UploadChangeParam<UploadFile>) => {
        storageClient.setFileList(info.fileList)
    };

    useAsync(async () => {
            const files = await storageClient.storageRef.listAll()

            const items = []
            for (const file of files.items) {
                const meta = await file.getMetadata()
                items.push({
                    url: await file.getDownloadURL(),
                    name: file.name,
                    status: 'done',
                    uid: file.fullPath,
                    size: meta.size,
                    type: meta.contentType
                } as FileType)

            }
            storageClient.setFileList(items)
        }, []
    );


    return (
        <div css={
            theme => css`
                .ant-upload-list-item {
                    background-color: ${theme.colors.light} !important;
                }
            `
        }>
            <Upload.Dragger
                css={
                    theme => css`
                        height: 8rem !important;
                        background-color: ${theme.colors.light} !important;
                    `
                }
                listType="picture"
                customRequest={(request) => uploadFile({
                    ...request,
                    baseRef: storageClient.storageRef
                })}
                beforeUpload={isManualSubmit ? (file, FileList) => {
                    return false
                } : null}
                fileList={storageClient.fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={async (file) => {
                    return storageClient.storageRef.child(file.name).delete()
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to this
                    area
                    to upload</p>
            </Upload.Dragger>
            <Modal
                visible={state.previewVisible}
                title={state.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                {PreviewComponent}
            </Modal>
        </div>
    )
}
