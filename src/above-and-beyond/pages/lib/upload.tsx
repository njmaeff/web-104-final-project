import React from "react";
import {UploadRequestOption} from "rc-upload/lib/interface";
import type {Reference} from "@firebase/storage-types";
import firebase from "firebase/compat/app";
import TaskEvent = firebase.storage.TaskEvent;

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

export const uploadFileList = (storageRef, fileList) => {
    const noop = () => ({})
    return Promise.all(
        fileList
            .filter((file) => {
                return !file.status
            })
            .map((file) => uploadFile({
                file: file.originFileObj ?? file,
                baseRef: storageRef,
                onError: noop,
                onProgress: noop,
                onSuccess: noop,
            }))
    );
};

