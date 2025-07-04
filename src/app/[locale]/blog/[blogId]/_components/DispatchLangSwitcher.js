'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLangSwitcherVisibility } from '@/app/[locale]/redux/langCurrSwitcherVisibility/langCurrSwitcherVisibilitySlice';

export default function DispatchLangSwitcher({ hasArabic }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch after mount to ensure it runs on the client
    dispatch(setLangSwitcherVisibility(hasArabic));
  }, [dispatch, hasArabic]);

  return null; // This component doesn't render UI
}