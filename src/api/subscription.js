import apiClient from './axios';

export const getPlans = () => apiClient.get('/subscription/plans');

export const getCurrentSubscription = () => apiClient.get('/subscription/current');

export const initiateSubscription = (planId) =>
    apiClient.post('/subscription/initiate', { plan_id: planId });
