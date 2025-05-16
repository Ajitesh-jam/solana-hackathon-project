"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import JSZip from "jszip";

export default function GameCard({ game, index }) {
  const [isHovered, setIsHovered] = useState(false)
      const zip = new JSZip(); // instance of JSZip

    // Function for make zip file and download it

    async function handleZip(){


      const zip = new JSZip();
      const fileName = game.downloadLink.split('/').pop(); // Extract the file name from the URL
      const fileUrl = game.downloadLink; // URL of the file to be downloaded
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      zip.file(fileName, blob);
      const content = await zip.generateAsync({ type: "blob" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = fileName;
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href); // Clean up the URL object


    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-xl bg-gray-800 shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <Image
          src={game.image || "/cod.png"}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{game.name}</h3>
        <p className="text-gray-400 mb-4">{game.description}</p>
        <Link href={game.link}>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Play Now
          </Button>
        </Link>
        <br></br>
        <br></br>

        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" onClick={handleZip}>
          Download
        </Button>
        <br></br>
      </div>

      {isHovered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
        </motion.div>
      )}
    </motion.div>
  )
}
