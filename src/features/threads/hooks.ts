"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listThreads,
  listThreadsWithRepliesSince,
  getThreadDetails,
  sendReply,
} from "./calls";

const POLL_INTERVAL_MS = 30_000;

export const threadKeys = {
  all: ["threads"] as const,
  detail: (id: string) => [...threadKeys.all, id] as const,
};

export const useThreads = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: threadKeys.all,
    queryFn: listThreads,
    enabled: options?.enabled ?? true,
    // App default staleTime is 60s — without overrides the list (and bell) would stay stale
    // until a manual refresh. Poll invalidations also need fresh data to refetch.
    staleTime: 0,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
};

/** Polls inbound replies persisted after the rolling cursor; refreshes thread queries when new replies land. */
export function useThreadReplyPoll(enabled: boolean) {
  const queryClient = useQueryClient();
  const afterRef = useRef<string | null>(null);

  return useQuery({
    queryKey: [...threadKeys.all, "replies-since-poll"] as const,
    queryFn: async () => {
      if (afterRef.current === null) {
        afterRef.current = new Date().toISOString();
      }
      const after = afterRef.current;
      const threads = await listThreadsWithRepliesSince(after);
      afterRef.current = new Date().toISOString();
      if (threads.length > 0) {
        // exact: true — only refetch GET /threads, not this poll query (avoids refetch loops)
        queryClient.invalidateQueries({ queryKey: threadKeys.all, exact: true });
      }
      return threads;
    },
    enabled,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });
}

export const useThreadDetails = (id: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: threadKeys.detail(id),
    queryFn: () => getThreadDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      queryClient.invalidateQueries({ queryKey: threadKeys.all, exact: true });
    }
  }, [query.isSuccess, query.data?.id, queryClient]);

  return query;
};

export const useSendReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: threadKeys.all });
    },
  });
};
