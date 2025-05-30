import { useMutationData } from "./use-mutation"
import { createAutomations, deleteKeyword, saveKeywords, saveListner, savePosts, saveTrigger, updateAutomationName } from "@/action/automation"
import { useEffect, useRef, useState } from "react"
import { z } from 'zod'
import useZodForm from "./use-zod-from"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { TRIGGER } from "@/redux/slices/automation"

export const useCreateAutomation = (id?: string) => {
    const { isPending , mutate } = useMutationData(
        ['create-automation'],
        () => createAutomations(id),
        "user-automations"
    )

    return { isPending , mutate } 
}

export const useEditAutomation = (automationId: string) => {
    const [edit , setEdit] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const enableEdit = () => setEdit(true)
    const disableEdit = () => setEdit(false)

    const { isPending, mutate } = useMutationData(
        ['update-automation'],
        (data:{name:string})=> 
            updateAutomationName(automationId , { name: data.name}),
        'automation-info',
        disableEdit
    )

    
    useEffect(()=>{
        function handleClickOutside(this: Document, event: MouseEvent){
            if(inputRef.current && !inputRef.current.contains(event.target as Node | null)){
                if(inputRef.current.value !== ""){
                    mutate({ name: inputRef.current.value})
                } else {
                    disableEdit()
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside) 
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }    
    }, [])

    return {
        edit,
        enableEdit,
        disableEdit,
        inputRef,
        isPending
    }
}

export const useListner = (id: string) => {
    const [ listner , setListner ] = useState<'MESSAGE' | 'SMARTAI' | null>(null)
    const promptSchema = z.object({
        prompt: z.string().min(1),
        reply: z.string(),
    })

    const { isPending, mutate } = useMutationData(
        ['create-Lister'],
        (data: { prompt: string; reply: string }) => 
            saveListner(id , listner || "MESSAGE", data.prompt , data.reply),
        'automation-info'
    )

    const { errors, onFormSubmit , register, reset , watch} = useZodForm(
        promptSchema,
        mutate
    )

    const onSetListner = (type: 'SMARTAI' | 'MESSAGE') => setListner(type)
    return { onSetListner , register , onFormSubmit , listner , isPending}
}



export const useTrigger = (id: string) => {
    const types = useAppSelector((state)=> state.AutomationReducer.trigger?.types)

    const dispatch: AppDispatch = useDispatch()

    const onSetTrigger = (type: 'COMMENT' | 'DM') => {
        dispatch(TRIGGER({ trigger: {type}}))
    }

    const { isPending, mutate } = useMutationData(
        ['add-trigger'] ,
        (data: { types: string[]})=> saveTrigger(id, data.types),
        "automation-info"
    )

    const onSaveTrigger = () => mutate({ types })
    return { types, onSetTrigger ,  onSaveTrigger , isPending}
}


export const useKeywords = (id: string) => {
    const [keyword , setKeyword] = useState('')
    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)

    const { mutate } = useMutationData(
        ['add-keywords'],
        (data: { keyword : string})=> saveKeywords(id, data.keyword),
        'automation-info',
        () => setKeyword('')
    )

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            mutate({ keyword })    
            setKeyword('')
        }
    }

    const { mutate: deleteMutation} = useMutationData(
        ['delete-keywords'],
        (data: { id : string})=> deleteKeyword(data.id),
        'automation-info',
    )

    return { keyword , onValueChange , onKeyPress , deleteMutation}
}

export const useAutomationPosts = ( id: string) => {

    const [posts, setPosts] = useState<
    {
        postid: string
        caption?: string
        media: string
        mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM' 
    }[]
    >([])


    const onSelectPost = (post: {
        postid: string
        caption?: string
        media: string
        mediaType: 'IMAGE' | 'VIDEO' | 'CAROSEL_ALBUM'     
    }) => {
        setPosts((prevItems) => {
            if(prevItems.find((p)=>p.postid === post.postid)){
                return prevItems.filter((item) => item.postid !== post.postid)
            } else {
                return [ ...prevItems, post]  
            }
        })
    }

    const { mutate, isPending } = useMutationData(
        ['attach-posts'], 
        () => savePosts(id , posts),
        'automation-info',
        () => setPosts([])
    )

    return { posts, onSelectPost, mutate, isPending}
}
