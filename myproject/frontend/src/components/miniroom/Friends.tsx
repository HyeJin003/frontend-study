"use client"

import { getFriends } from "@/services/friendService";
import { FriendshipEntry } from "@/types";
import { useState, useEffect } from "react";

export default function Friends() {

    const [friends, setFriends] = useState<FriendshipEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getFriends()
            .then((data) => setFriends(data))
            .catch(() => setErrorMessage("친구 목록을 불러오지 못했어요"))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>로딩중..</p>;

    return (
        <div>
            {errorMessage && <p>{errorMessage}</p>}
            {friends.length === 0 ? (
                <p>아직 친구가 없어요</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {friends.map((friend) => (
                        <div key={friend.id} className="border border-border rounded-xl p-4">
                            <p className="font-medium text-sm">{friend.friendNickname}</p>
                            {friend.friendBio && (
                                <p className="text-sm text-muted-foreground">{friend.friendBio}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {new Date(friend.createdAt).toLocaleDateString("ko-KR")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
