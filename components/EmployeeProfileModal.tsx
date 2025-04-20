import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import EmployeeProfileCard from './EmployeeProfileCard';
import { supabase } from '@/lib/supabase';
import PdfModalView from './PdfModalView';
import { useTheme } from '@/app/ThemeContext';

type Props = {
  employee_id: string;
  isVisible: boolean;
  setVisible: (val: boolean) => void;
};

const EmployeeProfileModalCard: React.FC<Props> = ({ isVisible, setVisible, employee_id }) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeData = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employee_id)
      .single();

    if (error) {
      console.error('Error fetching employee:', error.message);
      setError('Failed to load employee profile.');
    } else {
      setEmployeeData(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (employee_id && isVisible) {
      fetchEmployeeData();
    }
  }, [employee_id, isVisible]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styles.modalContainer} onPress={() => setVisible(false)}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#76802C" />
            ) : error || !employeeData ? (
              <Text style={styles.errorText}>{error || 'No employee found.'}</Text>
            ) : (
              <>
                <EmployeeProfileCard
                  item={employeeData}
                  alternate={true}
                  profileImage={employeeData.profile_url}
                  showActionButton={false}
                />
                <View style={styles.experienceContainer}>
                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[styles.experienceTitle, { color: '#F1F0E6' }]}>About</Text>
                    <PdfModalView resumeUrl={employeeData.resume_url ?? ''} />
                  </View>
                  <Text style={[styles.description, { color: '#F1F0E6' }]}>
                    {employeeData.bio}
                  </Text>
                </View>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const useStyles = (theme: any) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Transparent background
  },
  modalContent: {
    width: "90%",
    backgroundColor: theme.lightGray1,
    borderRadius: 20,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  experienceContainer: {
    backgroundColor: "#343436",
    padding: 12,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 25,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#E4F554",
  },
  description: {
    fontSize: 13,
    color: "#E4F554",
  },

});

export default EmployeeProfileModalCard;
