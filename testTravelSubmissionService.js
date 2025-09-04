import { TravelSubmissionService } from './src/services/supabaseService.js';

async function testTravelSubmissionService() {
    console.log('🧪 Testing Travel Submission Service...');
    
    try {
        // Test adding a sample submission
        const testSubmission = {
            full_name: 'John Doe',
            phone: '+971501234567',
            email: 'john.doe@example.com',
            trip_duration: 7,
            journey_month: 'December 2024',
            departure_country: 'United States',
            emirates: ['dubai', 'abu-dhabi'],
            budget: '5000-10000',
            adults: 2,
            kids: 1,
            infants: 0,
            submission_status: 'pending'
        };

        console.log('\n➕ Adding test submission...');
        const newSubmission = await TravelSubmissionService.addSubmission(testSubmission);
        console.log('✅ Submission added with ID:', newSubmission.id);

        // Test getting all submissions
        console.log('\n📋 Getting all submissions...');
        const allSubmissions = await TravelSubmissionService.getAllSubmissions();
        console.log(`✅ Found ${allSubmissions.length} submissions`);

        if (allSubmissions.length > 0) {
            const latest = allSubmissions[0];
            console.log('\n📄 Latest Submission:');
            console.log('- Name:', latest.full_name);
            console.log('- Email:', latest.email);
            console.log('- Phone:', latest.phone);
            console.log('- Trip Duration:', latest.trip_duration, 'nights');
            console.log('- Journey Month:', latest.journey_month);
            console.log('- Departure Country:', latest.departure_country);
            console.log('- Emirates:', latest.emirates.join(', '));
            console.log('- Total Travelers:', latest.total_travelers);
            console.log('- Status:', latest.submission_status);
            console.log('- Submitted:', new Date(latest.created_at).toLocaleString());
        }

        console.log('\n🎉 Travel Submission Service is working correctly!');
        console.log('\n📝 Next Steps:');
        console.log('1. Go to Admin Panel → Customer Management');
        console.log('2. Submit a travel form to see it appear in the dashboard');
        console.log('3. Test the status updates and customer management features');
        
    } catch (error) {
        console.error('\n❌ Error testing travel submission service:', error);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure you ran the updated schema.sql in Supabase');
        console.log('2. Check that the travel_submissions table exists');
        console.log('3. Verify your Supabase connection is working');
    }
}

testTravelSubmissionService();
