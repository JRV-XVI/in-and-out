import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterProps {
  label?: string;
  active?: 'Completados' | 'Ascendente' | 'Descendente';
  onChange?: (value: 'Completados' | 'Ascendente' | 'Descendente') => void;
}

const getIcon = (active: string) => {
  if (active === 'Completados') {
    return <MaterialCommunityIcons name="filter-variant" size={22} color="#CE0E2D" />;
  }
  if (active === 'Ascendente') {
    return <MaterialCommunityIcons name="sort-ascending" size={22} color="#CE0E2D" />;
  }
  if (active === 'Descendente') {
    return <MaterialCommunityIcons name="sort-descending" size={22} color="#CE0E2D" />;
  }
  return <Ionicons name="filter" size={22} color="#CE0E2D" />;
};

const options: Array<'Completados' | 'Ascendente' | 'Descendente'> = [
  'Completados',
  'Ascendente',
  'Descendente',
];

const Filter: React.FC<FilterProps> = ({
  label = 'Ordenar por:',
  active = 'Completados',
  onChange,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (value: 'Completados' | 'Ascendente' | 'Descendente') => {
    setDropdownVisible(false);
    if (onChange) onChange(value);
  };

  return (
    <View style={styles.filterRow}>
      <Text style={styles.filterText}>
        {label} <Text style={styles.filterActive}>{active}</Text>
      </Text>
      <TouchableOpacity
        onPress={() => setDropdownVisible(v => !v)}
        style={styles.iconBtn}
      >
        {getIcon(active)}
        <Ionicons
          name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#CE0E2D"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionBtn,
                active === opt && styles.optionActive,
              ]}
              onPress={() => handleSelect(opt)}
            >
              <Text style={[
                styles.optionText,
                active === opt && styles.optionTextActive,
              ]}>
                {opt}
              </Text>
              {getIcon(opt)}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  filterText: {
    color: '#5C5C60',
    fontSize: 14,
  },
  filterActive: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
  iconBtn: {
    marginLeft: 'auto',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: -8,
    top: 38,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minWidth: 160,
    zIndex: 100,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  optionActive: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    flex: 1,
    color: '#5C5C60',
    fontSize: 16,
  },
  optionTextActive: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
});

export default Filter;