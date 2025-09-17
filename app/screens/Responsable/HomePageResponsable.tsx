import React, { useState } from 'react';
import HomePageTemplate from '../../components/screens/HomePageTemplate';

const HomePageResponsable = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={setActiveTab}
      onMyDonations={() => {}}
      onRegisterDonation={() => {}}
    >
      {/* Aquí va el contenido específico de la pantalla */}
    </HomePageTemplate>
  );
};

export default HomePageResponsable;