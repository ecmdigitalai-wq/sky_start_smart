import axios from "axios";
import { useState, useEffect } from "react";
import { ToastAndroid } from "react-native";

const useFetch = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gradeData, setGradeData] = useState([]);

  const showToast = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  const getGrade = async () => {
    try {
      const res = await axios.get(
        "https://start-smart-backend.vercel.app/api/grades"
      );
      setGradeData(res.data);
    } catch (error) {
      showToast("Error: ", error.message);
    }
  };

  const getBooks = async () => {
    try {
      const res = await axios.get(
        "https://start-smart-backend.vercel.app/api/books"
      );
      setData(res.data);
    } catch (error) {
      showToast("Error: ", error.message);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      await getBooks();
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGrade = async () => {
    setIsLoading(true);

    try {
      await getGrade();
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchGrade();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
    fetchGrade();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    gradeData,
  };
};

export default useFetch;
