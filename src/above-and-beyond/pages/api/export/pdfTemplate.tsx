import React from 'react';
import {Document, Page, StyleSheet, Text, View,} from '@react-pdf/renderer';
import {Rate} from '../../lib/orm/validate';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
export const DocumentTemplate: React.FC = ({children}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {children}
        </Page>
    </Document>
);


export const RateDocumentTemplate: React.FC<{ record: Rate }> = ({record}) => {

    return <DocumentTemplate>
        <View style={styles.section}>
            <Text>Type: {record.type}</Text>
            <Text>Date: {record.date}</Text>
            <Text>Situation: {record.situation}</Text>
            <Text>Result: {record.result}</Text>
            {record.type === 'issue' ?
                <Text>Correction: {record.correction}</Text> : null}
        </View>
    </DocumentTemplate>
};
