// VirtualUniversity.tsx
import React from 'react';
import Head from 'next/head';
function Testing() {
    return (
        <>
            {/* Set the page title */}
            <Head>
                <title>Virtual University of Pakistan</title>
            </Head>

            {/* Center content vertically and horizontally */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <h1>Virtual University of Pakistan</h1>
            </div>
        </>
    );
}

export default Testing;
