import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { AdminSidebar } from "./Sidebar";
import { getOrders } from "../../requests";
import { UserData } from "../../redux/userSlice";
import { RootState } from "../../store/mainStore";
import { Order } from "../../models/Order";
import { DeliveryIcon } from "../../components/SVG";

export const translateStatus = (status: string) => {
  switch (status) {
    case "Pending":
      return "Awaiting payment";
    case "Shipped":
      return "In progress";
    case "Delivered":
      return "Delivered";
    case "Canceled":
      return "Cancelled";
    default:
      return status;
  }
};

const AdminOrders = ({ userData }: { userData: UserData }) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchOrders = async (skip: number) => {
    try {
      const response = await getOrders(userData.access, skip, pageSize);
      setOrdersList(response.orders);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(startIndex);
  }, [startIndex]);

  return (
    <div className="min-h-[70vh] bg-[var(--soft-surface)] text-[var(--base)]">
      <div className="page-container py-10 space-y-6">
        <AdminSidebar />
        <h1 className="text-3xl font-semibold">All orders</h1>

        <div className="flex flex-col gap-4">
          {ordersList.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No orders yet.</p>
          )}
          {ordersList.map((order) => (
            <Link
              to={`/admin/orders/${order.id}`}
              key={order.id}
              className="card flex items-center justify-between p-4 text-left transition hover:-translate-y-1"
            >
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  {translateStatus(order.status)}
                </p>
              </div>
              <div className="flex flex-col items-end text-sm text-[var(--muted)]">
                <p>Placed {order.date}</p>
                <div className="flex items-center gap-1">
                  <DeliveryIcon width={20} height={20} color="text-gray-500" />
                  <p>
                    {order.courier.name} {order.courier.surname} (
                    {order.courier.license_plate})
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStartIndex(Math.max(0, startIndex - pageSize))}
            disabled={startIndex === 0}
            className="ghost-button disabled:opacity-50"
          >
            Previous page
          </button>
          <span className="text-sm text-[var(--muted)]">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, total)} of{" "}
            {total}
          </span>
          <button
            onClick={() => setStartIndex(startIndex + pageSize)}
            disabled={startIndex + pageSize >= total}
            className="ghost-button disabled:opacity-50"
          >
            Next page
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({ userData: state.user.user });

export default connect(mapStateToProps)(AdminOrders);
