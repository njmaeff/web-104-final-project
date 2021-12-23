import {Modal, Upload} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import React, {useReducer} from "react";
import {useAsync} from "./hooks/useAsync";
import {UploadRequestOption} from "rc-upload/lib/interface";
import type {Reference} from "@firebase/storage-types";
import {UploadChangeParam} from "antd/lib/upload";
import {UploadFile} from 'antd/lib/upload/interface';
import {css} from "@emotion/react";

export enum UploadStates {
    FIREBASE_UPLOAD_PROGRESS,
    FIREBASE_UPLOAD_ERROR,
    FIREBASE_UPLOAD_END
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

    task.on(
        "state_changed",

        function progress(snapshot) {
            dispatch({type: UploadStates.FIREBASE_UPLOAD_PROGRESS});
            onProgress({
                percent: Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100
            }, file);
        },

        function error(err) {
            dispatch({type: UploadStates.FIREBASE_UPLOAD_ERROR, payload: err});
            onError(err, file);
        },

        function complete() {
            const fileRef = task.snapshot.ref
            fileRef.getDownloadURL().then(fileUrl => {
                dispatch({
                    type: UploadStates.FIREBASE_UPLOAD_END,
                    payload: {
                        fileUrl,
                        name: fileRef.name
                    }
                })
                onSuccess(fileUrl, file);
            });
        }
    )
};

export const firebaseUploadReducer = (state, action) => {

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

export const getBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const Uploads: React.FC<{ baseRef: Reference }> = ({baseRef}) => {

    const [state, dispatch] = useReducer(firebaseUploadReducer, {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })

    const handleCancel = () => dispatch({
        previewVisible: false
    });

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        dispatch({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    const handleChange = ({fileList}: UploadChangeParam<UploadFile>) => {
        dispatch({
            fileList,
        })
    };

    useAsync(async () => {
            const files = await baseRef.listAll()

            const items = []
            for (const file of files.items) {
                items.push({
                    url: await file.getDownloadURL(),
                    name: file.name,
                    status: 'done',
                    uid: file.fullPath,
                })

            }
            dispatch({fileList: items})
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
                customRequest={(request) => firebaseUploadAction({
                    ...request,
                    baseRef
                })(dispatch)}
                fileList={state.fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={async (file) => {
                    return baseRef.child(file.name).delete()
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area
                    to upload</p>
                {/*<div>*/}
                {/*    <PlusOutlined/>*/}
                {/*</div>*/}
            </Upload.Dragger>
            <Modal
                // css={
                //     css`
                //         .ant-modal-body {
                //             height: 60vh;
                //         }
                //     `
                // }
                visible={state.previewVisible}
                title={state.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                {/*<iframe src={state.previewImage} width={'100%'} height={'100%'}/>*/}
                <img alt="example" style={{width: '100%'}}
                     src={state.previewImage}/>
            </Modal>
        </div>
    );
}
