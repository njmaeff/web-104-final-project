import {Modal, Upload} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import React, {useReducer} from "react";
import {useAsync} from "./hooks/useAsync";
import {UploadRequestOption} from "rc-upload/lib/interface";
import type {Reference} from "@firebase/storage-types";
import {UploadChangeParam} from "antd/lib/upload";
import {UploadFile} from 'antd/lib/upload/interface';
import {css} from "@emotion/react";
import firebase from "firebase/compat/app";
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

export const firebaseUploadAction = ({
                                         onSuccess,
                                         onProgress,
                                         onError,
                                         file,
                                         baseRef
                                     }: UploadRequestOption & { baseRef: Reference }) => (dispatch) => {

    const storageRef = baseRef.child(file.name);
    const task = storageRef.put(file);
    return new Promise((resolve, reject) => {
        task.on(
            TaskEvent.STATE_CHANGED,
            {
                next(snapshot) {
                    dispatch({type: UploadStates.FIREBASE_UPLOAD_PROGRESS});
                    onProgress({
                        percent: Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    }, file);
                },
                error(err) {
                    dispatch({
                        type: UploadStates.FIREBASE_UPLOAD_ERROR,
                        payload: err
                    });
                    onError(err, file);
                },

                complete() {
                    const fileRef = task.snapshot.ref

                    fileRef.getDownloadURL()
                        .then(fileUrl => {
                            dispatch({
                                type: UploadStates.FIREBASE_UPLOAD_END,
                                payload: {
                                    fileUrl,
                                    name: fileRef.name
                                }
                            })
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
    fileList: FileType[]
    onProgress?: boolean
    onComplete?: boolean
    upLoadError?: Error
    previewVisible: boolean
    PreviewComponent: React.ComponentType
    previewTitle: string
}

export const firebaseUploadReducer: React.Reducer<UploadState, any> = (state, action) => {

    switch (action.type) {
        case UploadStates.FIREBASE_UPLOAD_PROGRESS:
            return {
                ...state,
                onProgress: true, onComplete: false
            }
        case UploadStates.FIREBASE_UPLOAD_ERROR:
            return {
                ...state,
                onProgress: false,
                onComplete: false,
                uploadError: action.payload
            }
        case UploadStates.FIREBASE_UPLOAD_END:
            const fileToUpdate = (state.fileList as any[]).find((file) => file.name === action.payload.name)
            fileToUpdate.url = action.payload.fileUrl
            return {
                ...state,
                onProgress: false,
                onComplete: true,
            }
        default:
            return {...state, ...action};
    }
};

export const useUpload = ({storageRef}: { storageRef: Reference }) => {

        const [{
            PreviewComponent,
            ...state
        }, dispatch] = useReducer(firebaseUploadReducer, {
            previewVisible: false,
            PreviewComponent: <></>,
            previewTitle: '',
            fileList: [],
        } as any)

        const handleCancel = () => dispatch({
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

            dispatch({
                PreviewComponent,
                previewVisible: true,
                previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
            });
        };

        const handleChange = (info: UploadChangeParam<UploadFile>) => {
            dispatch({
                fileList: info.fileList,
            })
        };

        const manualSubmit = async (path = '') => {
            const noop = () => ({})
            const baseRef = storageRef.child(path)
            await Promise.all(
                state.fileList
                    .filter((file) => {
                        return !file.status
                    })
                    .map((file) => firebaseUploadAction({
                        file: file.originFileObj ?? file,
                        baseRef,
                        onError: noop,
                        onProgress: noop,
                        onSuccess: noop,
                    })(dispatch))
            );
        }

        useAsync(async () => {
                const files = await storageRef.listAll()

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
                dispatch({fileList: items})
            }, []
        );

        return {
            manualSubmit,
            handleChange,
            handlePreview,
            handleCancel,
            PreviewComponent,
            storageRef,
            dispatch,
            ...state,
        } as const;
    }
;

export const UploadContainer = ({
                                    isManualSubmit,
                                    handleChange,
                                    handlePreview,
                                    storageRef,
                                    dispatch,
                                    handleCancel,
                                    previewVisible,
                                    previewTitle,
                                    fileList,
                                    PreviewComponent
                                }) => (
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
            customRequest={(request) => firebaseUploadAction({
                ...request,
                baseRef: storageRef
            })(dispatch)}
            beforeUpload={isManualSubmit ? (file, FileList) => {
                return false
            } : null}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={async (file) => {
                return storageRef.child(file.name).delete()
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
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
        >
            {PreviewComponent}
        </Modal>
    </div>
)
