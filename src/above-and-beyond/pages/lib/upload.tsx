import {Modal, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useState} from "react";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const Uploads = () => {

    const [state, updateState] = useState({
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    })

    const handleCancel = () => updateState(prev => ({
        ...prev,
        previewVisible: false
    }));

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        updateState(prev => ({
            ...prev,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        }));
    };

    const handleChange = ({fileList}) => updateState(prev => ({
        ...prev,
        fileList
    }));

    const uploadButton = (
        <div>
            <PlusOutlined/>
        </div>
    );
    return (
        <>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                fileList={state.fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {state.fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal
                visible={state.previewVisible}
                title={state.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{width: '100%'}}
                     src={state.previewImage}/>
            </Modal>
        </>
    );
}
