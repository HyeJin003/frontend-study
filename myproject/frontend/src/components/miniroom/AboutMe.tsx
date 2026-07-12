'use client'
//   import { useState } from 'react'
//   import { updateMe } from '@/services/authService'

import { updateMe } from "@/services/authService";
import { Button } from "@/components/ui/button" 
import { useState } from "react";


// 실무자 :  "AboutMe 컴포넌트 만들어줘. 유저 bio 보여주고, 본인이면 수정도 되게."
// 나 : bio 값이 필요 하고 , 본인이면 수정가능 하니깐, 본인 페이지 인지 아닌지 필요 하다고 생각함


type AboutMeProps = {
    bio: string | null;
    isOwner: boolean;
}

// 컴포넌트가 상태를 가져야 하나? ->  응 가져야 한다고 생각해 이유는  : 수정 버튼 누를시 편집창이 열리고 닫혀야 하니깐 , textrea 에 쓰는 내용도 어딘가에 저장이 필요 
export default function AboutMe({ bio, isOwner }: AboutMeProps) {
    
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(bio ?? '');

    const handleSave = async () => {
        
        try {
            await updateMe({ bio: value })
            setIsEditing(false);
        } catch (error) {
            alert(" 저장 실패 ");
        }
    }



    return (
        <div className="border border-border rounded p-4">
            <div className="flex flex-row justify-between">
                <h2 className="font-bold">About Me</h2>
                {isOwner && !isEditing && (
                    <Button onClick={() => setIsEditing(true)}>편집</Button>
                
            ) }
        </div>
        {
        isEditing ? (
            <div className="flex flex-col gap-2 mt-2">
                <textarea  className="w-full border border-border rounded-xl p-2" value={value} onChange={event => setValue(event.target.value)} />
                <Button onClick={handleSave}>저장</Button>
            </div>
        ) : (
            <p  className="text-muted-foreground">{value ||  '아직 한마디가 없어요'  }</p>
        )}



            </div >
        )
    }
