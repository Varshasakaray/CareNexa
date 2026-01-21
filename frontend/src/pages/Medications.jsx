import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Bell, BellOff, Calendar, Clock, Pill } from "lucide-react";
import { format, parseISO } from "date-fns";

const Medications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: medications, isLoading } = useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const response = await medicationsAPI.getAll({ activeOnly: "true" });
      return response.data.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => medicationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medication deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete medication");
    },
  });

  const toggleReminderMutation = useMutation({
    mutationFn: ({ id, reminderEnabled }) => 
      medicationsAPI.update(id, { reminderEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Reminder setting updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update reminder");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleReminder = (medication) => {
    toggleReminderMutation.mutate({
      id: medication._id,
      reminderEnabled: !medication.reminderEnabled,
    });
  };

  const getFrequencyLabel = (freq) => {
    const labels = {
      once: "Once daily",
      twice: "Twice daily",
      thrice: "Three times daily",
      four_times: "Four times daily",
      as_needed: "As needed",
    };
    return labels[freq] || freq;
  };

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
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2]">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin mx-auto mb-4 text-[#00b4d8]">⏳</div>
          <p className="text-gray-600 font-medium">Loading medications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2] pb-12">
      <motion.div
        className="container mx-auto p-4 md:p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00b4d8] to-[#bbd0ff] bg-clip-text text-transparent flex items-center gap-3">
              <Pill className="w-10 h-10 text-[#00b4d8]" />
              Medications
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your medications and reminders</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate("/medications/add")}
              className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0099c4] text-white shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Add Medication
            </Button>
          </motion.div>
        </motion.div>

        {medications && medications.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#00b4d8]/20">
              <CardContent className="py-16 text-center">
                <Pill className="w-16 h-16 mx-auto mb-4 text-[#00b4d8] opacity-50" />
                <p className="text-gray-500 mb-6 text-lg">No medications added yet</p>
                <Button
                  onClick={() => navigate("/medications/add")}
                  className="bg-[#00b4d8] hover:bg-[#0099c4] text-white"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Medication
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {medications?.map((medication, index) => (
              <motion.div
                key={medication._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#bbd0ff]/20 h-full flex flex-col">
                  <CardHeader className="bg-gradient-to-r from-[#bbd0ff]/20 to-[#caf0f8]/20 border-b border-[#eae0d5]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                          <Pill className="w-5 h-5 text-[#00b4d8]" />
                          {medication.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {medication.dosage} • {getFrequencyLabel(medication.frequency)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleReminder(medication)}
                          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                          title={medication.reminderEnabled ? "Disable reminder" : "Enable reminder"}
                        >
                          {medication.reminderEnabled ? (
                            <Bell className="w-5 h-5 text-[#00b4d8]" fill="#00b4d8" />
                          ) : (
                            <BellOff className="w-5 h-5 text-gray-400" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/medications/edit/${medication._id}`)}
                          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        >
                          <Edit className="w-5 h-5 text-[#bbd0ff]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(medication._id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </motion.button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6 flex-1">
                    {/* Times */}
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-[#00b4d8] mt-0.5" />
                      <div className="flex flex-wrap gap-2">
                        {medication.times.map((time, idx) => (
                          <Badge
                            key={idx}
                            className="bg-[#caf0f8] text-[#00b4d8] border border-[#00b4d8]/30 font-semibold"
                          >
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#bbd0ff]" />
                      <span>
                        Started: {format(parseISO(medication.startDate), "MMM dd, yyyy")}
                      </span>
                      {medication.endDate && (
                        <>
                          <span>•</span>
                          <span>
                            Until: {format(parseISO(medication.endDate), "MMM dd, yyyy")}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Reminder Status */}
                    <div className="flex items-center gap-2">
                      {medication.reminderEnabled && medication.emailReminder ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                          Email reminders enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-300">
                          Reminders disabled
                        </Badge>
                      )}
                    </div>

                    {/* Notes */}
                    {medication.notes && (
                      <div className="pt-2 border-t border-[#eae0d5]">
                        <p className="text-sm text-gray-600 italic">
                          {medication.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Medications;
