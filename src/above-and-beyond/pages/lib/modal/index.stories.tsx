import {BlockModalContainer} from "./blockModal";
import {ConfirmModal} from "./confirmModal";

export const BlockContainer = () => {
    return <BlockModalContainer
        visible={true}>Processing...</BlockModalContainer>
}

export const Confirm = () => <ConfirmModal visible={true}>This change will be
    permanent</ConfirmModal>

export default {}
