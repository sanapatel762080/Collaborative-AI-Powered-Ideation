import React from "react"
import AIChat from "../components/AIChat";
export default function AIPage(){
    return(
        <div className="flex">
      <div className="w-64 bg-gray-800 text-white p-4">Sidebar</div>
      <div className="flex-1 p-6">
        <AIChat />
      </div>
    </div>
    )
}