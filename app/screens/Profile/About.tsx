import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import { useNavigation } from '@react-navigation/native';

const About = () => {
  const navigation = useNavigation(); 

  return (
    <GeneralTemplate
      title="Nosotros"
      onBackPress={() => navigation.goBack()} 
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Contacto y Voluntariado */}
        <Text style={styles.contact}>Tel: (33) 3810-6595 | Sé un voluntario</Text>
        {/* Logotipo */}
        <Image
          source={require('../../assets/logo/logo-2.svg')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Origen y propósito */}
        <Text style={styles.sectionTitle}>Origen y propósito</Text>
        <Text style={styles.subTitle}>Nuestro origen</Text>
        <Text style={styles.paragraph}>
          Banco de Alimentos Guadalajara es una organización sin fines de lucro con la misión de generar acceso a una alimentación digna para personas en situación vulnerable en nuestra comunidad. Nuestro objetivo es contribuir a la reducción de la inseguridad alimentaria que afecta a más de un millón doscientas mil personas en el Estado de Jalisco.
        </Text>
        <Text style={styles.paragraph}>
          Actualmente, distribuimos alimento a más de 150,000 personas en 361 comunidades de la Zona Metropolitana de Guadalajara y del Interior del Estado de Jalisco. Mensualmente, movilizamos más de 1 millón 300 mil kilogramos de alimento para distribuirlos en la población en situación vulnerable.
        </Text>
        <Text style={styles.paragraph}>
          Además de la entrega directa de despensas en las comunidades, el Banco de Alimentos Guadalajara apoya a 155 instituciones de asistencia social, que a su vez benefician a personas de la tercera edad, casas hogar, personas en proceso de rehabilitación por adicciones, así como otras causas de alto valor para la sociedad.
        </Text>

        {/* Identidad institucional */}
        <Text style={styles.sectionTitle}>Identidad institucional</Text>
        <Text style={styles.bold}>Misión</Text>
        <Text style={styles.paragraph}>
          Generar acceso a una alimentación digna para personas en situación vulnerable en nuestra comunidad.
        </Text>
        <Text style={styles.bold}>Visión</Text>
        <Text style={styles.paragraph}>
          Abatir la pobreza alimentaria en Jalisco.
        </Text>
        <Text style={styles.bold}>Valores</Text>
        <Text style={styles.paragraph}>
          Calidad | Confianza | Integridad | Compromiso | Pasión
        </Text>

        {/* Datos informativos */}
        <Text style={styles.sectionTitle}>Datos informativos</Text>
        <Text style={styles.paragraph}>
          Tenemos una plantilla de 107 colaboradores y el apoyo de 100 voluntarios diarios.
          Cada mes beneficiamos a más de 35,000 familias, entre las cuales se componen de la siguiente manera:
        </Text>
        <View style={styles.stats}>
          <Text>30,523 Familias atendidas cada mes</Text>
          <Text>135,208 Personas atendidas cada mes</Text>
          <Text>15'618,499 kg Alimento acopiado</Text>
          <Text>161 Instituciones atendidas</Text>
          <Text>17,000 toneladas de comida rescatadas cada año</Text>
          <Text>555 patrocinadores en 4 ejes: Mercado de abastos, Pymes, Tiendas de Autoservicio y Campos Agrícolas</Text>
          <Text>361 comunidades atendidas en ZMG y Jalisco</Text>
          <Text>600,000 despensas repartidas cada año</Text>
        </View>

        {/* El Reto */}
        <Text style={styles.sectionTitle}>El Reto</Text>
        <Text style={styles.paragraph}>
          En esencia, el problema es la mala repartición de los alimentos en nuestra ciudad.
        </Text>
        <Text style={styles.bold}>Alimentación adecuada</Text>
        <Text style={styles.paragraph}>
          En la zona metropolitana de Guadalajara, aproximadamente 15% de la población vive en condiciones de pobreza, lo que significa que unas 1’200,000 personas no tienen acceso a una alimentación adecuada.
        </Text>
        <Text style={styles.bold}>Desperdicio de comida</Text>
        <Text style={styles.paragraph}>
          Se produce mucha más comida de la que se necesita para alimentar a toda la población, pero los alimentos no llegan a todos y en su lugar, se desperdician. Sobra más de lo que falta.
        </Text>

        {/* Transparencia */}
        <Text style={styles.sectionTitle}>Transparencia</Text>
        <Text style={styles.paragraph}>
          Donataria autorizada por el SAT. Autorización Secretaría del Sistema de Asistencia Social.
        </Text>
        <Text style={styles.link}>Descargar Informe Anual 2024</Text>

        {/* Qué hacemos */}
        <Text style={styles.sectionTitle}>Qué hacemos y cómo lo hacemos</Text>
        <Text style={styles.paragraph}>
          Rescate de alimento &gt; selección &gt; distribución &gt; entrega con ayuda de la comunidad &gt; educación con programas
        </Text>
        <View style={styles.steps}>
          <Text>1. Identificamos y solicitamos donativos a las empresas.</Text>
          <Text>2. Trasladamos el donativo a nuestras instalaciones.</Text>
          <Text>3. Iniciamos con la separación, clasificación y resguardo de los alimentos.</Text>
          <Text>4. Distribuimos y entregamos el alimento en despensas a las familias más vulnerables.</Text>
        </View>

        {/* Canasta básica */}
        <Text style={styles.sectionTitle}>Canasta básica</Text>
        <Text style={styles.paragraph}>
          Frijol, arroz, pastas, azúcar, avena, soya, lenteja, aceite, trigo inflado, frutas y verduras, embutidos y lácteos, abarrotes, artículos de limpieza.
        </Text>

        {/* Información */}
        <Text style={styles.sectionTitle}>Información</Text>
        <Text style={styles.paragraph}>
          Hacienda de la Calerilla 360, Santa Maria Tequepexpan, Tlaquepaque, Jalisco.
          GDL : 33 3810 6595
          comunicacionbamx@bdalimentos.org
        </Text>
        <Text style={styles.paragraph}>
          Banco de Alimentos ® 2021 | Todos los derechos reservados | Aviso de privacidad
        </Text>
      </ScrollView>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#fff',
  },
  contact: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: '#CE0E2D',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#F19800',
  },
  paragraph: {
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  stats: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  steps: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  link: {
    color: '#F19800',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default About;