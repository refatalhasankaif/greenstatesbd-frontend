"use client";

import { useEffect, useState } from "react";
import { IGallery } from "@/types/gallery";
import { getMyGallery } from "@/lib/api/gallery";


export const useMyGallery = () => {
  const [data, setData] = useState<IGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyGallery()
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};