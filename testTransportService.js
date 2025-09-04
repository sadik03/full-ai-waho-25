import { TransportService } from './src/services/supabaseService.ts';

async function testTransportService() {
    console.log('Testing Transport Service...');
    
    try {
        // Test getting all transport
        const transports = await TransportService.getAllTransport();
        console.log(`\n✅ Transport Count: ${transports.length}`);
        
        if (transports.length > 0) {
            console.log('\n📋 First Transport Sample:');
            console.log('- Label:', transports[0].label);
            console.log('- Cost per day:', transports[0].cost_per_day);
            console.log('- Type:', transports[0].type);
            console.log('- Image URL:', transports[0].image_url);
            console.log('- Active:', transports[0].is_active);
            
            console.log('\n📊 Transport Statistics:');
            const avgCost = transports.reduce((sum, t) => sum + t.cost_per_day, 0) / transports.length;
            console.log(`- Total Transport Options: ${transports.length}`);
            console.log(`- Average Cost per Day: AED ${avgCost.toFixed(0)}`);
            
            const activeCount = transports.filter(t => t.is_active !== false).length;
            console.log(`- Active Options: ${activeCount}`);
            
            const types = [...new Set(transports.map(t => t.type).filter(Boolean))];
            console.log(`- Types Available: ${types.join(', ')}`);
        }
        
    } catch (error) {
        console.error('❌ Error testing transport service:', error);
    }
}

testTransportService();
