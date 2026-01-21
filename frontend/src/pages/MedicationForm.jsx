import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { medicationsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Loader2, X, Pill, Clock, Save, Plus as PlusIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

const MedicationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "once",
    times: ["09:00"],
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    reminderEnabled: true,
    emailReminder: true,
    notes: "",
  });

  const [timeInput, setTimeInput] = useState("09:00");

  // Fetch existing medication if editing
  const { data: existingMedication, isLoading: isLoadingMedication } = useQuery({
    queryKey: ["medication", id],
    queryFn: () => medicationsAPI.getById(id).then(res => res.data.data),
    enabled: isEdit,
  });

  // Populate form when editing
  useEffect(() => {
    if (existingMedication) {
      const startDate = existingMedication.startDate 
        ? format(parseISO(existingMedication.startDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      
      const endDate = existingMedication.endDate
        ? format(parseISO(existingMedication.endDate), "yyyy-MM-dd")
        : "";

      setFormData({
        name: existingMedication.name || "",
        dosage: existingMedication.dosage || "",
        frequency: existingMedication.frequency || "once",
        times: existingMedication.times || ["09:00"],
        startDate,
        endDate,
        reminderEnabled: existingMedication.reminderEnabled !== undefined ? existingMedication.reminderEnabled : true,
        emailReminder: existingMedication.emailReminder !== undefined ? existingMedication.emailReminder : true,
        notes: existingMedication.notes || "",
      });
      
      if (existingMedication.times && existingMedication.times.length > 0) {
        setTimeInput(existingMedication.times[0]);
      }
    }
  }, [existingMedication]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return isEdit 
        ? medicationsAPI.update(id, data)
        : medicationsAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success(isEdit ? "Medication updated successfully" : "Medication added successfully");
      navigate("/medications");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save medication");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTime = () => {
    if (timeInput && !formData.times.includes(timeInput)) {
      setFormData((prev) => ({
        ...prev,
        times: [...prev.times, timeInput].sort(),
      }));
      setTimeInput("");
    }
  };

  const handleRemoveTime = (timeToRemove) => {
    if (formData.times.length > 1) {
      setFormData((prev) => ({
        ...prev,
        times: prev.times.filter((t) => t !== timeToRemove),
      }));
    } else {
      toast.error("At least one time is required");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dosage || formData.times.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };

    mutation.mutate(submitData);
  };

  if (isEdit && isLoadingMedication) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2] py-8">
      <div className="container mx-auto p-4 md:p-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/medications")}
            className="mb-6 text-[#00b4d8] hover:text-[#0099c4] hover:bg-[#caf0f8]/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Medications
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-[#bbd0ff]/20">
              <CardHeader className="bg-gradient-to-r from-[#bbd0ff]/20 to-[#caf0f8]/20 border-b border-[#eae0d5]">
                <div className="flex items-center gap-3">
                  <Pill className="w-6 h-6 text-[#00b4d8]" />
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {isEdit ? "Edit" : "Add"} Medication
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Add medication details and set up email reminders
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-base font-semibold text-gray-700">
                      Medication Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Aspirin"
                      className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                      required
                    />
                  </motion.div>

                  {/* Dosage */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="dosage" className="text-base font-semibold text-gray-700">
                      Dosage *
                    </Label>
                    <Input
                      id="dosage"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                      placeholder="e.g., 100mg"
                      className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                      required
                    />
                  </motion.div>

                  {/* Frequency */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="frequency" className="text-base font-semibold text-gray-700">
                      Frequency *
                    </Label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#eae0d5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent bg-white text-gray-800 font-medium transition-all h-12 text-lg"
                    >
                      <option value="once">Once daily</option>
                      <option value="twice">Twice daily</option>
                      <option value="thrice">Three times daily</option>
                      <option value="four_times">Four times daily</option>
                      <option value="as_needed">As needed</option>
                    </select>
                  </motion.div>

                  {/* Times */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00b4d8]" />
                      Reminder Times *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={timeInput}
                        onChange={(e) => setTimeInput(e.target.value)}
                        className="flex-1 border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          onClick={handleAddTime}
                          disabled={!timeInput || formData.times.includes(timeInput)}
                          className="bg-[#bbd0ff] hover:bg-[#a8c0ff] text-white h-12"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </motion.div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.times.map((time, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 bg-[#caf0f8] text-[#00b4d8] border border-[#00b4d8]/30 font-semibold text-sm px-3 py-1"
                          >
                            {time}
                            <button
                              type="button"
                              onClick={() => handleRemoveTime(time)}
                              className="ml-1 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Dates */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-base font-semibold text-gray-700">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-base font-semibold text-gray-700">
                        End Date (Optional)
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate}
                        className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                      />
                    </div>
                  </motion.div>

                  {/* Reminder Settings */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3 p-4 bg-gradient-to-r from-[#caf0f8]/30 to-[#bbd0ff]/30 rounded-lg border-2 border-[#eae0d5]"
                  >
                    <Label className="text-base font-semibold text-gray-700">Reminder Settings</Label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="reminderEnabled"
                          checked={formData.reminderEnabled}
                          onChange={handleChange}
                          className="w-5 h-5 text-[#00b4d8] border-2 border-[#eae0d5] rounded focus:ring-2 focus:ring-[#00b4d8] cursor-pointer"
                        />
                        <span className="text-gray-700 font-medium group-hover:text-[#00b4d8] transition-colors">
                          Enable reminders
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="emailReminder"
                          checked={formData.emailReminder}
                          onChange={handleChange}
                          disabled={!formData.reminderEnabled}
                          className="w-5 h-5 text-[#00b4d8] border-2 border-[#eae0d5] rounded focus:ring-2 focus:ring-[#00b4d8] cursor-pointer disabled:opacity-50"
                        />
                        <span className={`font-medium transition-colors ${formData.reminderEnabled ? 'text-gray-700 group-hover:text-[#00b4d8]' : 'text-gray-400'}`}>
                          Send email reminders
                        </span>
                      </label>
                    </div>
                  </motion.div>

                  {/* Notes */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="notes" className="text-base font-semibold text-gray-700">
                      Notes (Optional)
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-[#eae0d5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent bg-white text-gray-800 resize-none transition-all"
                      placeholder="Any additional notes or instructions..."
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex gap-4 pt-4"
                  >
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="flex-1 h-12 bg-[#00b4d8] hover:bg-[#0099c4] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {isEdit ? "Update Medication" : "Add Medication"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/medications")}
                      className="h-12 border-2 border-[#eae0d5] hover:bg-[#caf0f8]/50 text-gray-700 font-semibold"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicationForm;
