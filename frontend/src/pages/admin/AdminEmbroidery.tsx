import { useState, useEffect } from "react";
import { Eye, Edit, Check, X, Bell, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EmbroideryRequest {
  id: string;
  user_id: string;
  user_email: string;
  name: string;
  mobile_number: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  design_image_url: string;
  shipping_cost: number;
  design_cost: number;
  total_cost: number;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

const AdminEmbroidery = () => {
  const [requests, setRequests] = useState<EmbroideryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<EmbroideryRequest | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [designCost, setDesignCost] = useState("");
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/embroidery/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch requests');

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load embroidery requests");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request: EmbroideryRequest) => {
    setEditingId(request.id);
    setDesignCost(request.design_cost?.toString() || "");
    setStatus(request.status);
    setAdminNotes(request.admin_notes || "");
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/embroidery/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          design_cost: parseFloat(designCost) || 0,
          status,
          admin_notes: adminNotes
        })
      });

      if (!response.ok) throw new Error('Failed to update request');

      toast.success("Request updated successfully");
      setEditingId(null);
      fetchRequests();
    } catch (error) {
      toast.error("Failed to update request");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setDesignCost("");
    setStatus("");
    setAdminNotes("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'quoted': return 'bg-blue-500/10 text-blue-600';
      case 'approved': return 'bg-green-500/10 text-green-600';
      case 'in_progress': return 'bg-purple-500/10 text-purple-600';
      case 'completed': return 'bg-green-600/10 text-green-700';
      case 'cancelled': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const isRejectedByUser = (request: EmbroideryRequest) => {
    return request.status === 'cancelled' && 
           request.admin_notes && 
           request.admin_notes.includes('[User Rejection]');
  };

  const isNewlyApproved = (request: EmbroideryRequest) => {
    return request.status === 'approved';
  };

  const needsAction = (request: EmbroideryRequest) => {
    return request.status === 'pending' || request.status === 'approved';
  };

  const handleStartWork = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/embroidery/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          status: 'in_progress',
          design_cost: requests.find(r => r.id === id)?.design_cost || 0,
          admin_notes: requests.find(r => r.id === id)?.admin_notes || ''
        })
      });

      if (!response.ok) throw new Error('Failed to start work');

      toast.success("Status updated to In Progress");
      fetchRequests();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading embroidery requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Embroidery Requests</h1>
        <p className="text-muted-foreground">
          Manage custom embroidery design requests and quotes
        </p>
      </div>

      {/* Summary Cards */}
      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">User Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {requests.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Awaiting Response</p>
                <p className="text-2xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'quoted').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <p className="text-muted-foreground">No embroidery requests yet</p>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All ({requests.length})
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("approved")}
              className={filterStatus === "approved" ? "" : "border-green-500/20 text-green-600 hover:bg-green-500/10"}
            >
              Approved ({requests.filter(r => r.status === 'approved').length})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
              className={filterStatus === "pending" ? "" : "border-yellow-500/20 text-yellow-600 hover:bg-yellow-500/10"}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </Button>
            <Button
              variant={filterStatus === "quoted" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("quoted")}
              className={filterStatus === "quoted" ? "" : "border-blue-500/20 text-blue-600 hover:bg-blue-500/10"}
            >
              Quoted ({requests.filter(r => r.status === 'quoted').length})
            </Button>
            <Button
              variant={filterStatus === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("in_progress")}
              className={filterStatus === "in_progress" ? "" : "border-purple-500/20 text-purple-600 hover:bg-purple-500/10"}
            >
              In Progress ({requests.filter(r => r.status === 'in_progress').length})
            </Button>
          </div>

        <div className="space-y-4">
          {requests
            .filter(r => filterStatus === "all" || r.status === filterStatus)
            .sort((a, b) => {
              // Sort approved requests first, then by created date
              if (a.status === 'approved' && b.status !== 'approved') return -1;
              if (a.status !== 'approved' && b.status === 'approved') return 1;
              if (a.status === 'pending' && b.status !== 'pending' && b.status !== 'approved') return -1;
              if (a.status !== 'pending' && b.status === 'pending' && a.status !== 'approved') return 1;
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })
            .map((request) => (
            <div 
              key={request.id} 
              className={`bg-background border rounded-lg p-6 ${
                needsAction(request) ? 'border-accent shadow-lg' : 'border-border'
              }`}
            >
              {/* Action Required Banner */}
              {isNewlyApproved(request) && (
                <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-green-600 animate-pulse" />
                    <div>
                      <p className="font-semibold text-green-700">User Approved Quote!</p>
                      <p className="text-sm text-green-600">Ready to start work on this design</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartWork(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Work
                  </Button>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Customer Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">{request.user_email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {isRejectedByUser(request) && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600">
                          USER REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Mobile:</span> {request.mobile_number}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {request.address}
                    </div>
                    <div>
                      <span className="font-medium">City:</span> {request.city || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">State:</span> {request.state}
                    </div>
                    <div>
                      <span className="font-medium">Pincode:</span> {request.pincode || 'N/A'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Shipping Cost:</span>
                      <span className="font-medium">₹{request.shipping_cost}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Design Cost:</span>
                      <span className="font-medium">₹{request.design_cost || 0}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Cost:</span>
                      <span className="text-accent">₹{request.total_cost || request.shipping_cost}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Submitted: {new Date(request.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Right Column - Design Image & Actions */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Design Image</label>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <img 
                        src={request.design_image_url} 
                        alt="Design" 
                        className="w-full h-64 object-contain bg-secondary/30 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedRequest(request)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Image
                    </Button>
                  </div>

                  {editingId === request.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-2">Design Cost (₹)</label>
                        <Input
                          type="number"
                          value={designCost}
                          onChange={(e) => setDesignCost(e.target.value)}
                          placeholder="Enter design cost"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-2">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full p-2 rounded-md border border-input bg-background"
                        >
                          <option value="pending">Pending</option>
                          <option value="quoted">Quoted</option>
                          <option value="approved">Approved</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-2">Admin Notes</label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          className="w-full p-2 rounded-md border border-input bg-background resize-none"
                          placeholder="Add notes for internal reference"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleUpdate(request.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {request.admin_notes && (
                        <div className={`p-3 rounded-md ${isRejectedByUser(request) ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-secondary/30'}`}>
                          <p className="text-sm font-medium mb-1">
                            {isRejectedByUser(request) ? 'User Rejection Reason:' : 'Admin Notes:'}
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.admin_notes}</p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleEdit(request)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Quote & Status
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Image Modal */}
      {selectedRequest && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img 
              src={selectedRequest.design_image_url} 
              alt="Design Full View" 
              className="w-full h-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
            onClick={() => setSelectedRequest(null)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminEmbroidery;
