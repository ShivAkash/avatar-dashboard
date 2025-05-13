"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AvatarFallback from "@/components/AvatarFallback";
import CreateAvatarForm from "@/components/CreateAvatarForm";
import dynamic from 'next/dynamic';

const DynamicThreeDAvatar = dynamic(() => import('@/components/ThreeDAvatar'), {
  ssr: false,
  loading: () => <AvatarFallback name="Loading..." />
});

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [activeModel, setActiveModel] = useState<number | null>(null);

  useEffect(() => {
    
    fetch("https://reqres.in/api/users?page=1&per_page=3", {
      headers: {
        "x-api-key": "reqres-free-v1"  
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setUsers(data.data);
        } else {
          throw new Error("API returned unexpected format");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <motion.header 
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
        <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-800 dark:text-white tracking-tight font-inter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              DCVerse
              </span>
            </h1>
            <p className="mt-6 text-2xl text-slate-600 dark:text-slate-300 font-inter">
              Hello! Meet our Virtual Influencers.
            </p>
        </div>
        </motion.header>

        {/* Avatar Cards Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            {/* <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {users.length} Avatars
            </Badge> */}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0 h-48">
                    <Skeleton className="h-full w-full" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <motion.div variants={itemVariants} className="col-span-3 text-center py-16">
              <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Error Loading Data
                </h3>
                <p className="text-red-600 mb-6">
                  There was a problem loading avatar data from the server. Please try again later.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                >
                  Retry
                </Button>
              </div>
            </motion.div>
          ) : users.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {users.map((user) => (
                <motion.div 
                  key={user.id} 
                  variants={itemVariants}
                  className={activeModel === user.id ? "ring-2 ring-blue-500" : ""}
                  onMouseEnter={() => setActiveModel(user.id)}
                  onMouseLeave={() => setActiveModel(null)}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <div className="h-64 overflow-hidden">
                        <DynamicThreeDAvatar 
                          userId={user.id} 
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/80 text-blue-600 hover:bg-white">
                          3D Model
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-6 pb-3">
                      <div className="flex items-center space-x-4 mb-2">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.first_name} />
                          <AvatarFallback name={user.first_name.charAt(0) + user.last_name.charAt(0)} />
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{`${user.first_name} ${user.last_name}`}</h3>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        variant="outline"
                        onClick={() => console.log(`Edit avatar for ${user.first_name}`)}
                        className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        Edit Avatar
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="col-span-3 text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  No avatars found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  You don't have any avatars yet. Create your first AI avatar to get started.
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  Create Your First Avatar
                </Button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Floating Action Button */}
        <motion.div
          className="fixed right-6 bottom-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
        >
          <Button 
            onClick={() => setIsModalOpen(true)} 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="sr-only">Create New Avatar</span>
          </Button>
        </motion.div>

        {/* Dialog Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Avatar</DialogTitle>
                </DialogHeader>
                <CreateAvatarForm onClose={() => setIsModalOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}