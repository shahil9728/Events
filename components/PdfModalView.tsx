import { ICONTYPE } from '@/app/globalConstants';
import { useTheme } from '@/app/ThemeContext';
import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  Linking,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';


interface PdfModalProps {
  resumeUrl: string;
}

const PdfModalView: React.FC<PdfModalProps> = ({ resumeUrl }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);

  const openModal = (e: GestureResponderEvent) => {
    e.preventDefault();
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false)
    setLoading(true)
  };


  return (
    <>
      <TouchableOpacity onPress={openModal}>
        <Text style={{ color: theme.primaryColor }}>View Resume</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View>
              {/* <TouchableOpacity onPress={viewPdf} style={styles.closeButton}>
                <Icon name='arrow-down-outline' type={ICONTYPE.IONICON} color='#fff' />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name='close' type={ICONTYPE.MATERIAL} color='#fff' />
              </TouchableOpacity>
            </View>
            <WebView
              originWhitelist={['*']}
              style={styles.webview}
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(resumeUrl)}`,
              }}
              cacheEnabled={true}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const useStyles = (theme: any) => StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
    margin: 10,
    zIndex: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: theme.lightGray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    backgroundColor: theme.lightGray1,
    flex: 1,
  },
});

export default PdfModalView;
