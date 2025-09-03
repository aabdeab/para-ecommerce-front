import React from 'react';
import Header from '../Components/Header';
import Main from '../Components/Main';
import Footer from '../Components/Footer';

const Home: React.FC = () => {
    return (
        <div className='flex flex-col min-h-screen '>
            <Header />
            <Main />
            <Footer />
        </div>
    );
};

export default Home;