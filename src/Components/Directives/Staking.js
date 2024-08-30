import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Staking = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [stakingPlans, setStakingPlans] = useState([]);
  const [plan, setPlan] = useState([]);
  const [userId, setUserId] = useState('');
  const [stakePlan, setStakePlan] = useState('');
  const [userStakingDetails, setUserStakingDetails] = useState([]);

  useEffect(() => {
    planList();
    fetchUserStakingDetails();

    // Retrieve userId from localStorage and set it in state
    const id = localStorage.getItem('token'); 
    console.log('iddfsdfs', id)
    if (id) {
      setUserId(id);
    } else {
      console.error('User ID is not found in localStorage.');
    }
  }, []);

  const planList = async () => {
    try {
      const res = await axios.get('http://localhost:3000/plans');
      if (res.data.success) {
        setStakingPlans(res.data.data);
        setPlan(res.data.data);
      } else {
        console.error('Error fetching staking plans:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching staking plans:', error.message);
    }
  };

  const fetchUserStakingDetails = async () => {
    try {
      if (!userId) {
        console.error('User ID is missing.');
        return;
      }

      const response = await axios.get(`http://localhost:3000/stake/${userId}`);
      if (response.data.success) {
        setUserStakingDetails(response.data.stakedData);
      } else {
        console.error('Error fetching user staking details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user staking details:', error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!userId) {
        console.error('User ID is missing.');
        return;
      }

      const response = await axios.post('http://localhost:3000/stake', {
        userId: userId,        
        planid: selectedPlan,  
        amount: stakeAmount,   
      });

      if (response.data.success) {
        console.log('Response:', response.data.message);
        fetchUserStakingDetails(); // Refresh user staking details after successful staking
      } else {
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error during staking:', error.response ? error.response.data : error.message);
    }
  };

  const handleStakeAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setStakeAmount(value);
    }
  };

  const handleUnstakeAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setUnstakeAmount(value);
    }
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
    setStakePlan(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.sectionTitle}>Available Staking Plans</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Plan Name</th>
            <th>Duration</th>
            <th>Minimum Amount</th>
            <th>Reward Percentage</th>
          </tr>
        </thead>
        <tbody>
          {plan.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.planName}</td>
              <td>{plan.duration} minutes</td>
              <td>${plan.minimumAmount}</td>
              <td>{plan.rewardPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.stakeUnstakeContainer}>
        <div style={styles.stakeSection}>
          <h3 style={styles.sectionTitle}>Stake</h3>
          <input
            style={styles.input}
            type="number"
            placeholder="Enter amount to stake"
            value={stakeAmount}
            onChange={handleStakeAmountChange}
          />
          <select
            style={styles.dropdown}
            onChange={handlePlanChange}
            value={selectedPlan}
          >
            <option value="">Select staking plan</option>
            {stakingPlans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {`${plan.planName} - ${plan.rewardPercentage}%`}
              </option>
            ))}
          </select>
          <button style={styles.stakeButton} onClick={handleSubmit}>Stake</button>
        </div>

        <div style={styles.unstakeSection}>
          <h3 style={styles.sectionTitle}>Unstake</h3>
          <select style={styles.dropdown}>
            <option value="">Select your staking details</option>
            {userStakingDetails.map((stake) => (
              <option key={stake._id} value={stake._id}>
                {`${stake.planName} - ${stake.amountStaked}`}
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            type="number"
            placeholder="Enter amount to unstake"
            value={unstakeAmount}
            onChange={handleUnstakeAmountChange}
          />
          <div style={styles.card}>Earned Rewards: $500</div>
          <button style={styles.unstakeButton}>Unstake</button>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Your Staking Details</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Staking Plan</th>
            <th>Amount Staked</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Earned Rewards</th>
            <th>Claim Rewards</th>
          </tr>
        </thead>
        <tbody>
          {userStakingDetails.length > 0 ? (
            userStakingDetails.map((stake) => (
              <tr key={stake._id}>
                <td>{stake.planName}</td>
                <td>${stake.amountStaked}</td>
                <td>{new Date(stake.startDate).toLocaleDateString()}</td>
                <td>{new Date(stake.endDate).toLocaleDateString()}</td>
                <td>${stake.rewardsEarned}</td>
                <td><button style={styles.claimButton}>Claim</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No staking details available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    marginLeft: '250px',
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
  },
  sectionTitle: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600',
  },
  stakeUnstakeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '40px',
  },
  stakeSection: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    border: '1px solid #d0d6dd',
  },
  unstakeSection: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    border: '1px solid #d0d6dd',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #d0d6dd',
    boxSizing: 'border-box',
  },
  dropdown: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #d0d6dd',
    boxSizing: 'border-box',
  },
  stakeButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #1e90ff 0%, #4682b4 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  unstakeButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #ff4c4c 0%, #c0392b 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  claimButton: {
    padding: '8px 16px',
    background: 'linear-gradient(90deg, #1e90ff 0%, #4682b4 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  card: {
    padding: '12px',
    background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
    borderRadius: '8px',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: '500',
  }
};

export default Staking;
